/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
    async fetch(request, env, ctx) {
        
        const url = new URL(request.url);
        const path = url.pathname;

        
        if (path === "/api/entries") {
            const results = await env.mood_logger_db.prepare("SELECT * FROM entries").all();
            return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" },
            });
        }

		if (path === "/api/add-entry" && request.method === "POST") {
			const body = await request.json();
			const raw_text = body.raw_text;
			const input_type = body.input_type || "text";
			
			// ai analysis of mood
			const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
				prompt: 'Analyze this journal entry and respond in JSON format only: {"sentiment": "positive" or "negative" or "neutral", "mood_summary": "brief 1 sentence summary of their mood", "insights": "one helpful observation or suggestion"}\n\nJournal entry: ' + raw_text
			});

			// Parse the AI response
            let sentiment = "neutral";
            let mood_summary = "";
            let insights = "";

            try {
                const parsed = JSON.parse(aiResponse.response);
                sentiment = parsed.sentiment;
                mood_summary = parsed.mood_summary;
                insights = parsed.insights;
            } catch (e) {
                // If AI response isn't valid JSON, store raw response
                mood_summary = aiResponse.response;
            }

			await env.mood_logger_db
				.prepare("INSERT INTO entries (raw_text, input_type, sentiment, mood_summary, insights) VALUES (?, ?, ?, ?, ?)")
				.bind(raw_text, input_type, sentiment, mood_summary, insights)
				.run();

			return new Response(JSON.stringify({ 
                success: true, 
                sentiment,
                mood_summary,
                insights 
            }),
			{headers: { "Content-Type": "application/json" }});
		}

        // Default response for any other route
        return new Response("Mood Logger API");
    },
	
};