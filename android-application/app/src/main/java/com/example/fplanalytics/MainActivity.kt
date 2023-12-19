package com.example.fplanalytics

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.findNavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import kotlinx.android.synthetic.main.activity_main.nav_view

class MainActivity : AppCompatActivity() {
    private lateinit var navController: NavController
    private lateinit var app: MyApplication

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        app = (application as MyApplication)

        updateNavigationMenu(nav_view)

        val navHostFragment =
            supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment

        navController = navHostFragment.findNavController()

        val bottomNavigationView: BottomNavigationView = findViewById(R.id.nav_view)

        val appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.homeFragment,
                R.id.loginFragment,
                R.id.registerFragment,
                R.id.welcomeFragment,
                R.id.competitorTeamFragment
                // Add other top-level destinations here
            )
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        bottomNavigationView.setupWithNavController(navController)

        bottomNavigationView.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.menu_login -> {
                    // Handle login item click (navigate to login fragment)
                    val navController = findNavController(R.id.nav_host_fragment)
                    navController.navigate(R.id.loginFragment)
                    true
                }
                R.id.menu_register -> {
                    val navController = findNavController(R.id.nav_host_fragment)
                    navController.navigate(R.id.registerFragment)
                    true
                }
                R.id.navigation_profile -> {
                    val navController = findNavController(R.id.nav_host_fragment)
                    navController.navigate(R.id.homeFragment)
                    true
                }
                R.id.navigation_logout -> {
                    app.logoutUser()
                    updateNavigationMenuForLoggedInUser()
                    val navController = findNavController(R.id.nav_host_fragment)
                    navController.navigate(R.id.welcomeFragment)
                    true
                }
                R.id.navigation_competitor -> {
                    val navController = findNavController(R.id.nav_host_fragment)
                    navController.navigate(R.id.competitorTeamFragment)
                    true
                }
                else -> super.onOptionsItemSelected(item)
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp() || super.onSupportNavigateUp()
    }

    fun updateNavigationMenuForLoggedInUser() {
        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.nav_view)
        updateNavigationMenu(bottomNavigationView)
    }

    private fun updateNavigationMenu(bottomNavigationView: BottomNavigationView) {
        val navMenu = bottomNavigationView.menu
        if (app.user != null) {
            navMenu.setGroupVisible(R.id.logged_in_group, true)
            navMenu.setGroupVisible(R.id.logged_out_group, false)
        } else {
            navMenu.setGroupVisible(R.id.logged_in_group, false)
            navMenu.setGroupVisible(R.id.logged_out_group, true)
        }
    }

    fun setHomeAsSelected() {
        nav_view.selectedItemId = R.id.navigation_profile
    }
}