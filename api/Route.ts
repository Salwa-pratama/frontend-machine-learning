export const API_URL = `https://backend-machine-learning-awknjp2le-salwa-pratamas-projects.vercel.app/api`;

export async function testNaive(payload: any) {
  try {
    const res = await fetch(`${API_URL}/predict-nb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        error: true,
        message: "Server error",
        status: res.status,
      };
    }

    return await res.json();
  } catch (error: any) {
    return { error: true, message: error.message };
  }
}

export async function predictID3(payload: any) {
  try {
    const res = await fetch(`${API_URL}/predict-id3`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        error: true,
        message: "Server error",
        status: res.status,
      };
    }

    return await res.json();
  } catch (error: any) {
    return { error: true, message: error.message };
  }
}
