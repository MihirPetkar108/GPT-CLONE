import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: message,
                        },
                    ],
                },
            ],
        }),
    };

    try {
        const response = await fetch(
            "https://api.openai.com/v1/responses",
            options
        );
        const data = await response.json();
        return data.output[0].content[0].text;
    } catch (err) {
        console.log(err);
    }
};

export default getOpenAIAPIResponse;
