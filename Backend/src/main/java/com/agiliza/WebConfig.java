package com.agiliza;

import com.agiliza.security.AuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final JdbcTemplate jdbc;
    public WebConfig(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    @Override public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthInterceptor(jdbc)).addPathPatterns("/api/**")
                .excludePathPatterns("/api/auth/**");
    }
}
