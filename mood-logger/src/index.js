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
			const input_type = body.input_type;

			await env.mood_logger_db
				.prepare("INSERT INTO entries (raw_text, input_type) VALUES (?, ?)")
				.bind(raw_text, input_type)
				.run();

			return new Response(JSON.stringify({ success: true, message: "Entry added successfully" }), 
			{headers: { "Content-Type": "application/json" }});
		}

        // Default response for any other route
        return new Response("Mood Logger API");
    },
	
};