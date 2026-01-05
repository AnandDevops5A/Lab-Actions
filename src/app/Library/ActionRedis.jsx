"use server";

import client from "./Redis.jsx";



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
        await client.set(key, JSON.stringify(value), "XX", ttl);
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
        return parsedData;
    } catch (error) {
        console.error("Error getting cache:", error);
        return { status: false, error: error.message };
    }}