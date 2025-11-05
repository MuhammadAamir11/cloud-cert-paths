
# 04 — Roadmap & Next Steps

## Near‑term (high impact, low complexity)
1. **Compare** endpoint + page  
   - API: `GET /api/compare?left={id}&right={id}` → merged DTO  
   - UI: `/compare` with two dropdowns; side‑by‑side table

2. **Cross‑cloud mapping** (AWS ↔ Azure)  
   - Data: `mappings.json` (source_id, target_id, similarity, rationale[])  
   - API: `GET /api/map?from={id}` → top 1–3 equivalents (+ rationale)  
   - UI: mapping panel from cert card

3. **Path visualization**  
   - Data: `paths.json` (nodes = cert ids, edges = next steps)  
   - UI: simple SVG first; optional Cytoscape interop later

## Mid‑term
- **Better search & filters** (provider, level, role; fuzzy search)
- **AI Q&A (RAG)** with Azure OpenAI + citations
- **Cosmos DB** for dynamic content (admin updates without redeploy)
- **Auth** (SWA/Entra) for saved plans & bookmarks

## Ship & polish
- Deploy to Azure SWA + custom domain + HTTPS
- SEO: metadata per cert, sitemap, robots
- Analytics: App Insights (API) + lightweight web analytics
