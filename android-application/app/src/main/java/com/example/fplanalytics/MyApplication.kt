package com.example.fplanalytics

import android.app.Application
import android.view.View
import com.example.fplanalytics.apiServices.DBService
import com.example.fplanalytics.apiServices.FPLService
import com.example.fplanalytics.dataClasses.Manager
import com.example.fplanalytics.dataClasses.User
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import timber.log.Timber
import java.util.concurrent.TimeUnit

class MyApplication : Application() {
    lateinit var fplService: FPLService
    lateinit var dbService: DBService
    private var user: User? = null
    lateinit var myManager: Manager
    lateinit var competitorManager: Manager

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
            .baseUrl("https://fantasy.premierleague.com/api/")
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
        readFromSharedPreferences()
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
        getData(user.managerId)

        // save JSON of user object to shared preferences
        SharedPrefs.putString(
            SharedPrefs.USER,
            Json.encodeToString(User.serializer(), user)
        )
    }

    fun getUser() = this.user

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
        if (user != null) {
            getData(user!!.managerId)
        }
    }

    private fun getData(managerId: String?) {
        CoroutineScope(Dispatchers.IO).launch {
            val call: Call<Manager> = fplService.generalInfo()

            // Asynchronous call
            call.enqueue(object : Callback<Manager> {
                override fun onResponse(call: Call<Manager>, response: Response<Manager>) {
                    if (response.isSuccessful) {
                        //myManager = response.body()!!
                        val jsonString = """
                            {
                                "manager_first_name" : "Marko",
                                "manager_second_name" : "Roskar",
                                "country" : "SLO",
                                "favourite_team" : "MUN",
                                "current_rank" : 301547,
                                "total_points" : 1000,
                                "players" : [
                                    {
                                        "first_name" : "player1f",
                                        "second_name" : "player1s",
                                        "element_type" : 3
                                    },
                                    {
                                        "first_name" : "player2f",
                                        "second_name" : "player2s",
                                        "element_type" : 1
                                    },
                                    {
                                        "first_name" : "player3f",
                                        "second_name" : "player3s",
                                        "element_type" : 1
                                    },
                                    {
                                        "first_name" : "player4f",
                                        "second_name" : "player4s",
                                        "element_type" : 1
                                    },
                                    {
                                        "first_name" : "player5f",
                                        "second_name" : "player5s",
                                        "element_type" : 1
                                    },
                                    {
                                        "first_name" : "player6f",
                                        "second_name" : "player6s",
                                        "element_type" : 1
                                    },
                                    {
                                        "first_name" : "player7f",
                                        "second_name" : "player7s",
                                        "element_type" : 1
                                    },
                                    {
                                        "first_name" : "player8f",
                                        "second_name" : "player8s",
                                        "element_type" : 1
                                    }
                                ]
                            }
                            """.trimIndent()
                        myManager = Json.decodeFromString<Manager>(jsonString)
                    }else{
                        myManager = Manager("","","","",0,0,listOf())
                    }
                }

                override fun onFailure(call: Call<Manager>, t: Throwable) {
                    myManager = Manager("","","","",0,0,listOf())
                }
            })
        }
    }

    fun getCompetitorManager(managerId: String?) {
        CoroutineScope(Dispatchers.IO).launch {
            val call: Call<Manager> = fplService.generalInfo()

            // Asynchronous call
            call.enqueue(object : Callback<Manager> {
                override fun onResponse(call: Call<Manager>, response: Response<Manager>) {
                    competitorManager = if (response.isSuccessful) {
                        response.body()!!
                    }else{
                        Manager("","","","",0,0,listOf())
                    }
                }

                override fun onFailure(call: Call<Manager>, t: Throwable) {
                    competitorManager = Manager("","","","",0,0,listOf())
                }
            })
        }
    }
}