package com.example.fplanalytics.apiServices

import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface DBService {
    @POST("users/login")
    suspend fun login(@Body requestBody: RequestBody): Response<ResponseBody>

    @POST("users/register")
    suspend fun register(@Body requestBody: RequestBody): Response<ResponseBody>
}