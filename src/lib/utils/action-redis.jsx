"use server";

 import Redis from "ioredis";

const client = new Redis();

export const setCache = async (key, value, ttl = 3600) => {

    try {
        await client.set(key, JSON.stringify(value), "EX", ttl);
        return { status: true };
    }

    catch (error) {
        console.error("Error setting cache:", error);
        return { status: false, error: error.message };
    }

}

export const UpdateCache = async (key, value, ttl = 3600) => {

    try {
        await client.set(key, JSON.stringify(value), "EX", ttl, "XX");
        return { status: true };
    }

    catch (error) {
        console.error("Error setting cache:", error);
        return { status: false, error: error.message };
    }

}

export const getCache = async (key) => {

    try {
        const data = await client.get(key);
        if (!data) return { status: false, error: "Cache miss" };
        const parsedData=JSON.parse(data);
        return {data:parsedData, status: true };
    } catch (error) {
        console.error("Error getting cache:", error);
        return { status: false, error: error.message };
    }
}

export const deleteCache = async (key) => {

    try {
        await client.del(key);
        return { status: true };
    } catch (error) {
        // console.error("Error deleting cache:", error);
        return { status: false, error: error.message };
    }
}



