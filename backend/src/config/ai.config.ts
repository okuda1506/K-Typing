export const aiConfig = () => ({
    geminiApiKey: process.env.GEMINI_API_KEY ?? '',
    googleTtsApiKey: process.env.GOOGLE_TTS_API_KEY ?? '',
});
