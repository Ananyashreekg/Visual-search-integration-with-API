export const analyzeImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("http://localhost:5000/analyze", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        return { error: error.message };
    }
};
