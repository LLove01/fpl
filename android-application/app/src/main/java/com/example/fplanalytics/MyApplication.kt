package com.example.fplanalytics

import android.app.Application
import com.example.fplanalytics.apiServices.DBService
import com.example.fplanalytics.apiServices.FPLService
import com.example.fplanalytics.dataClasses.User
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import timber.log.Timber
import java.util.concurrent.TimeUnit


class MyApplication : Application() {
    lateinit var fplService: FPLService
    lateinit var dbService: DBService
    var user: User? = null

    override fun onCreate() {
        super.onCreate()

        //initialize timber logger
        Timber.plant(Timber.DebugTree())

        val okHttpClient: OkHttpClient = OkHttpClient().newBuilder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .build()

        val retrofitFpl = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3001/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        fplService = retrofitFpl.create(FPLService::class.java)

        val retrofitDb = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3001/")
            .client(okHttpClient)
            .build()

        dbService = retrofitDb.create(DBService::class.java)

        // initialize shared preferences adapter
        SharedPrefs.init(applicationContext)

        // read all saved shared preferences
        //readFromSharedPreferences()
    }

    fun getGsonInstance(): Gson {
        val gsonBuilder = GsonBuilder()
        return gsonBuilder.setPrettyPrinting().create()
    }

    // returns true if user doesn't equal to null
    fun isUserLoggedIn(): Boolean {
        if (user == null)
            return false
        return true
    }

    // set new user to shared preferences and user variable
    fun saveUser(user: User) {
        this.user = user

        // save JSON of user object to shared preferences
        SharedPrefs.putString(
            SharedPrefs.USER,
            Json.encodeToString(User.serializer(), user)
        )
    }

    // remove user from shared preferences and set variable user to null
    fun logoutUser() {
        SharedPrefs.putString(SharedPrefs.USER, "")
        user = null
    }

    // read all from shared preferences
    private fun readFromSharedPreferences() {
        user = try {
            Json.decodeFromString<User>(
                SharedPrefs.getString(SharedPrefs.USER, "")
            )
        } catch (e: Exception) {
            null
        }
    }
}