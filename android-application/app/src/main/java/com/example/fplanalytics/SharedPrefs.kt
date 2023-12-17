package com.example.fplanalytics

import android.content.Context
import android.content.Context.MODE_PRIVATE
import android.content.SharedPreferences

object SharedPrefs {

    private var sharedPreferences: SharedPreferences? = null

    // tags
    const val APP_UUID = "app_uuid"
    const val USER = "user"

    // needs to be called first but only once
    fun init(context: Context) {
        if (sharedPreferences == null)
            sharedPreferences = context.getSharedPreferences(context.packageName, MODE_PRIVATE)
    }

    // functions to read from and write to shared preferences
    fun getString(tag: String?, defaultValue: String?): String {
        return sharedPreferences!!.getString(tag, defaultValue) ?: ""
    }

    fun putString(tag: String?, value: String?) {
        val prefsEditor = sharedPreferences!!.edit()
        prefsEditor.putString(tag, value)
        prefsEditor.apply()
    }

    fun getBoolean(tag: String?, defaultValue: Boolean): Boolean =
        sharedPreferences!!.getBoolean(tag, defaultValue)

    fun putBoolean(tag: String?, value: Boolean) {
        val prefsEditor = sharedPreferences!!.edit()
        prefsEditor.putBoolean(tag, value)
        prefsEditor.apply()
    }

    fun getInt(tag: String?, defaultValue: Int): Int = sharedPreferences!!.getInt(tag, defaultValue)

    fun putInt(tag: String?, value: Int?) {
        val prefsEditor = sharedPreferences!!.edit()
        prefsEditor.putInt(tag, value!!).apply()
    }
}