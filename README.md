# cf_ai_PraiseOlatide
Simple Mood tracking app

## Features 
- Journal Entries
- AI-analysis
- Entry history


## Tech 
 - Runtime: cloudflare workers
 - Database: cloudflare D1
 - AI: cloudflare workers ai, llama3.1
 - frontend: vanilla html/css


### Prereqs
- node.js
- wrangler cli 
- cloudflare account

### installation
1. install dependencies
```bash
   cd mood-logger
   npm install
   ``` 
2. create the database
```bash
   cd mood-logger
   npm install
   ```

3. apply schema
```bash
   wrangler d1 execute mood-logger-db --file=src/db/schema.sql
   ```

4. start dev server:
```bash
   npm run dev
   ```

5. open http://localhost:8787 in your browser 