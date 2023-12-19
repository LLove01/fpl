package com.example.fplanalytics.apiServices

import com.example.fplanalytics.dataClasses.Manager
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Path

interface FPLService {
    @GET("fpl/{managerId}")
    fun getManagerData(@Path("managerId") managerId: String?): Call<ResponseBody>

    /*
    // Fetch information about an individual FPL manager
    export const fetchManagerInfo = async (teamId) => {
    const response = await fetch(`${BASE_URL}entry/${teamId}/`);
    return response.json();
    };
     */
}