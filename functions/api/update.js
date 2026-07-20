export async function onRequestPut(context) {
  try {
    const url = new URL(context.request.url);
    const id = Number(url.searchParams.get("id"));

    const { name, size, number } = await context.request.json();

    const cleanName = String(name || "").trim();
    const allowed = ["S", "M", "L", "XL", "XXL", "XXXL"];
    const jerseyNumber = Number(number);

    if (!Number.isInteger(id) || id < 1) {
      return json({ error: "Invalid player." }, 400);
    }

    if (!cleanName || cleanName.length > 50) {
      return json({ error: "Enter a valid name." }, 400);
    }

    if (!allowed.includes(size)) {
      return json({ error: "Select a valid size." }, 400);
    }

    if (
      !Number.isInteger(jerseyNumber) ||
      jerseyNumber < 0 ||
      jerseyNumber > 99
    ) {
      return json(
        { error: "Jersey number must be between 0 and 99." },
        400
      );
    }

    const result = await context.env.DB
      .prepare(`
        UPDATE registrations
        SET name = ?, size = ?, jersey_number = ?
        WHERE id = ?
      `)
      .bind(cleanName, size, jerseyNumber, id)
      .run();

    if (!result.meta.changes) {
      return json({ error: "Player not found." }, 404);
    }

    return json({ success: true });

  } catch (error) {
    console.error(error);

    return json(
      { error: "Something went wrong. Try again." },
      500
    );
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}