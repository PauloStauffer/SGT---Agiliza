<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- Keep the Agiliza prototype frontend-only with route-local demo state until persistent Cloud behavior is requested, so the current scope remains visual and interactive.
- Keep Home presentation variants in a dedicated component consuming shared route-local task state, so switching layouts never resets tasks or changes other views.
- Keep task cards as a presentation component consuming shared route-local tasks, so card and list views always reflect the same completion state.
- Derive the weekly calendar from route-local tasks and appointments and edit them through a draft dialog, so calendar rendering is read-only and canceled changes never affect shared data.
