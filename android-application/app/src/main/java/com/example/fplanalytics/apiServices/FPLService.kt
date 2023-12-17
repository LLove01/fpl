package com.example.fplanalytics.apiServices

import retrofit2.Call
import retrofit2.http.GET

interface FPLService {
    @GET("bootstrap-static")
    fun generalInfo(): Call<Map<String, Any>>
}