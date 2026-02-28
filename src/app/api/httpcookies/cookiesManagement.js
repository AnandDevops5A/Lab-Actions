// cookies management for the backend api
"use server";
import { cookies } from "next/headers";

export const getCookies = async () => {
    const cookieStore = await cookies();
    return cookieStore.getAll();
};

 const defaultCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict', // strict, lax, none
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
 };

export const setSecureCookie = async (name, value, options) => {
    try {
        if (!name || !value) {
            return { success: false, message: 'Name and value are required' };
        }
    const cookieStore = await cookies();
    cookieStore.set(name, value, { ...defaultCookieOptions, ...options });
    return { success: true, message: 'Cookie set successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to set cookie', error: error.message };
    }
};  

export const getSecureCookie = async (name) => {
    try {
        if (!name) {
            return { error: 'Name is required' };
        }
        const cookieStore = await cookies();
        const cookie = cookieStore.get(name);
        if (!cookie) {
            return { error: 'Cookie not found', success: false };
        }
        return { success: true, data: cookie.value };
    } catch (error) {
        return { error: 'Failed to get cookie', error: error.message, success: false };
    }
};

export const deleteSecureCookie = async (name) => {
    try {
        if (!name) {
            return { success: false, message: 'Name is required' };
        }
        const cookieStore = await cookies();
        cookieStore.delete(name);
    } catch (error) {
        return { success: false, message: 'Failed to delete cookie', error: error.message };
    }
};



