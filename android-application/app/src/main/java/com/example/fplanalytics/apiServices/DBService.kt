package com.example.fplanalytics.apiServices

import com.example.fplanalytics.dataClasses.Manager
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface DBService {
    @POST("users/login")
    suspend fun login(@Body requestBody: RequestBody): Response<ResponseBody>

    @POST("users/register")
    suspend fun register(@Body requestBody: RequestBody): Response<ResponseBody>


    @PUT("users/{managerId}")
    fun addCompetitor(@Path("managerId") managerId: String?, @Body requestBody: RequestBody): Call<ResponseBody>

    //@PUT("users/{managerId}")
    //fun addCompetitor(@Path("managerId") managerId: String?, @Body requestBody: RequestBody): Response<ResponseBody>
}