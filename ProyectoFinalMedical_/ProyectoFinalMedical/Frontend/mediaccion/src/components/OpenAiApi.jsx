import OpenAI from "openai";

const client = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export async function chatCerrado(prompt) {
  const PROMPT = `
  Quiero que analices el siguiente medicamento: ${prompt}

  Devuélveme la información exclusivamente en un JSON válido, sin texto adicional antes o después, y envuelto dentro de un bloque de código \`\`\`json.

  El JSON debe tener exactamente estos campos:

  {
    "medicamento": "",
    "descripcion": "",
    "uso": [],
    "dosis_recomendada": {
      "adultos": "",
      "niños": ""
    },
    "precauciones": [],
    "efectos_secundarios": []
  }

  Reglas:
  - "descripcion": Hazla muy resumida, simple y entendible para cualquier persona sin conocimientos médicos.
  - "uso": Lista de para qué sirve el medicamento.
  - "dosis_recomendada": Puede incluir diferentes dosis según edad. Si no aplica, escribe "No especificado".
  - "precauciones": Lista clara y breve.
  - "efectos_secundarios": Lista simple, enfocada en los más comunes.
  - No agregues nada fuera del JSON.
  - No hagas explicaciones.
  - No uses texto técnico innecesario.
  `;


  try {
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: PROMPT }]
    });

    const outputText = result.choices?.[0]?.message?.content || "Sin respuesta";

    // Extraemos el JSON del bloque ```json ... ```
    const match = outputText.match(/```json([\s\S]*?)```/i);
    const jsonText = match ? match[1].trim() : outputText.trim();

    let outputJSON;
    try {
      outputJSON = JSON.parse(jsonText);
    } catch (err) {
      outputJSON = { error: "Respuesta no es un JSON válido", raw: jsonText };
    }

    return outputJSON;
  } catch (error) {
    return { error: "Error al consultar la API" };
  }
}
