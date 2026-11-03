package com.agiliza;

import com.agiliza.security.AuthInterceptor;
import com.agiliza.security.PasswordHasher;
import java.security.SecureRandom;
import java.util.*;
import javax.servlet.http.HttpServletRequest;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final JdbcTemplate db;
    private final SecureRandom random = new SecureRandom();
    public ApiController(JdbcTemplate db) { this.db = db; }

    @GetMapping("/health")
    public Map<String, Object> health() { db.queryForObject("SELECT 1", Integer.class); return map("status", "ok", "database", "connected"); }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        String name = text(body, "name").trim(), email = text(body, "email").trim().toLowerCase(), password = text(body, "password");
        if (name.length() < 2 || name.length() > 255) return error("Informe um nome entre 2 e 255 caracteres.", "name");
        if (!email.matches("^\\S+@\\S+\\.\\S+$") || email.length() > 255) return error("Informe um e-mail válido.", "email");
        if (password.length() < 8 || password.length() > 128) return error("Use uma senha entre 8 e 128 caracteres.", "password");
        try {
            long id = db.queryForObject("INSERT INTO dbo.usuario(nome,email,senha) OUTPUT INSERTED.id_usuario VALUES(?,?,?)",
                    Long.class, name, email, PasswordHasher.hash(password));
            return ResponseEntity.status(201).body(map("user", user(id, name, email), "token", createSession(id)));
        } catch (DuplicateKeyException ex) { return ResponseEntity.status(409).body(map("message", "Este e-mail já está cadastrado.", "field", "email")); }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) {
        String email = text(body, "email").trim().toLowerCase(), password = text(body, "password");
        List<Map<String,Object>> rows = db.queryForList("SELECT id_usuario,nome,email,senha FROM dbo.usuario WHERE email=?", email);
        if (rows.isEmpty() || !PasswordHasher.matches(password, String.valueOf(rows.get(0).get("senha"))))
            return ResponseEntity.status(401).body(map("message", "E-mail ou senha incorretos."));
        Map<String,Object> row = rows.get(0); long id = ((Number) row.get("id_usuario")).longValue();
        return ResponseEntity.ok(map("user", user(id, String.valueOf(row.get("nome")), String.valueOf(row.get("email"))), "token", createSession(id)));
    }

    @GetMapping("/auth/me")
    public Map<String,Object> me(HttpServletRequest req) { return map("user", req.getAttribute("user")); }

    @PostMapping("/auth/logout")
    public ResponseEntity<Void> logout(HttpServletRequest req) {
        db.update("DELETE FROM dbo.sessao_usuario WHERE token_hash=?", req.getAttribute("tokenHash")); return ResponseEntity.noContent().build();
    }

    @GetMapping("/areas")
    public Map<String,Object> areas(HttpServletRequest req) {
        long uid = id(req); return map("areas", db.queryForList("SELECT a.id_area_pk id,a.nome name,a.cor color,COUNT(t.id_tarefa_pk) taskCount FROM dbo.area_da_vida a LEFT JOIN dbo.tarefa t ON t.id_area_fk=a.id_area_pk WHERE a.id_usuario_fk=? GROUP BY a.id_area_pk,a.nome,a.cor ORDER BY a.nome", uid));
    }

    @PostMapping("/areas")
    public ResponseEntity<?> addArea(@RequestBody Map<String,Object> b, HttpServletRequest req) {
        String name=text(b,"name").trim(); if(name.isEmpty()||name.length()>255)return error("Informe um nome de área válido.","name");
        Long id=db.queryForObject("INSERT INTO dbo.area_da_vida(id_usuario_fk,nome,cor) OUTPUT INSERTED.id_area_pk VALUES(?,?,?)",Long.class,id(req),name,b.get("color"));
        return ResponseEntity.status(201).body(map("area",map("id",id,"name",name,"color",b.get("color"),"taskCount",0)));
    }

    @GetMapping("/tasks")
    public Map<String,Object> tasks(HttpServletRequest req) {
        long uid=id(req); List<Map<String,Object>> result=db.queryForList("SELECT t.id_tarefa_pk id,t.titulo title,t.descricao description,t.data_limite date,t.horario_inicio startTime,t.duracao_estimada duration,t.prioridade priority,t.complexidade complexity,t.criticidade criticality,t.statu status,t.importante important,t.adiamentos postponed,t.tempo_gasto spent,a.nome area,m.titulo goal FROM dbo.tarefa t LEFT JOIN dbo.area_da_vida a ON a.id_area_pk=t.id_area_fk LEFT JOIN dbo.meta m ON m.id_meta_pk=t.id_meta_fk WHERE t.id_usuario_fk=? ORDER BY t.data_limite,t.horario_inicio",uid);
        for(Map<String,Object> row:result){ row.put("duration", parseInt(row.get("duration"),30)); row.put("done","Concluída".equals(row.get("status"))); row.put("areaId",null); row.put("goalId",null); row.put("time",row.get("duration")+"min"); row.put("overdue",false); }
        return map("tasks",result);
    }

    @PostMapping("/tasks")
    public ResponseEntity<?> addTask(@RequestBody Map<String,Object> b,HttpServletRequest req) {
        String title=text(b,"title").trim(); if(title.isEmpty()||title.length()>255)return error("Informe um título válido.","title");
        int duration=parseInt(b.get("duration"),30); if(duration<1||duration>1440)return error("A duração é inválida.","duration");
        Long id=db.queryForObject("INSERT INTO dbo.tarefa(id_usuario_fk,titulo,descricao,statu,data_limite,horario_inicio,prioridade,criticidade,complexidade,duracao_estimada,importante) OUTPUT INSERTED.id_tarefa_pk VALUES(?,?,?,?,?,?,?,?,?,?,?)",Long.class,id(req),title,text(b,"description"),b.getOrDefault("status","Não iniciada"),b.get("date"),b.get("startTime"),b.getOrDefault("priority","Média"),b.getOrDefault("criticality","Média"),b.getOrDefault("complexity","Média"),String.valueOf(duration),Boolean.TRUE.equals(b.get("important")));
        return ResponseEntity.status(201).body(map("task",map("id",id,"title",title,"duration",duration,"time",duration+"min","status",b.getOrDefault("status","Não iniciada"),"done",false)));
    }

    private String createSession(long id) { byte[] bytes=new byte[32]; random.nextBytes(bytes); String token=Base64.getUrlEncoder().withoutPadding().encodeToString(bytes); db.update("DELETE FROM dbo.sessao_usuario WHERE expira_em<=SYSUTCDATETIME(); INSERT INTO dbo.sessao_usuario(token_hash,id_usuario_fk,expira_em) VALUES(?,?,DATEADD(day,30,SYSUTCDATETIME()))",AuthInterceptor.sha256(token),id); return token; }
    private long id(HttpServletRequest r){ return ((Number)((Map<?,?>)r.getAttribute("user")).get("id")).longValue(); }
    private Map<String,Object> user(long id,String name,String email){return map("id",id,"name",name,"email",email);}
    private static String text(Map<String,Object> m,String k){Object v=m.get(k);return v==null?"":String.valueOf(v);}
    private static int parseInt(Object v,int d){try{return Integer.parseInt(String.valueOf(v));}catch(Exception e){return d;}}
    private static Map<String,Object> map(Object... values){Map<String,Object> m=new LinkedHashMap<>();for(int i=0;i<values.length;i+=2)m.put(String.valueOf(values[i]),values[i+1]);return m;}
    private static ResponseEntity<Map<String,Object>> error(String message,String field){return ResponseEntity.badRequest().body(map("message",message,"field",field));}
}
