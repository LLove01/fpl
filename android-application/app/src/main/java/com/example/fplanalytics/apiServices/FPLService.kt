package com.example.fplanalytics.apiServices

import com.example.fplanalytics.dataClasses.Manager
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Path

interface FPLService {
    @GET("bootstrap-static")
    fun generalInfo(): Call<Manager>

    @GET("entry/{teamId}")
    fun getManagerById(@Path("teamId") teamId: String?): Call<Map<String, Any>>

    /*
    // Fetch information about an individual FPL manager
    export const fetchManagerInfo = async (teamId) => {
    const response = await fetch(`${BASE_URL}entry/${teamId}/`);
    return response.json();
    };
     */
}