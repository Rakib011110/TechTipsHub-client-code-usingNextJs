import envConfig from "@/src/config/envConfig";

export const getFlowers = async (userid: string) => {
  if (!userid) {
    console.error("No user id found");

    return { data: [] };
  }

  const fetchOption = {
    next: {
      tags: ["flower"],
    },
  };

  try {
    const res = await fetch(
      `${envConfig.baseApi}/users/followers/${userid}`,
      fetchOption,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);

    return { data: [] }; // Return empty array in case of error
  }
};
export const getFlowing = async (userid: string) => {
  if (!userid) {
    console.error("No user id found");

    return { data: [] };
  }

  const fetchOption = {
    next: {
      tags: ["flowing"],
    },
  };

  try {
    const res = await fetch(
      `${envConfig.baseApi}/users/following/${userid}`,
      fetchOption,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);

    return { data: [] }; // Return empty array in case of error
  }
};
