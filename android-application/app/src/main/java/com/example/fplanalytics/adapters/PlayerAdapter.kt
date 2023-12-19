package com.example.fplanalytics.adapters

import android.annotation.SuppressLint
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fplanalytics.dataClasses.Player
import com.example.fplanalytics.R
import timber.log.Timber

class PlayerAdapter(private val data: List<Player>) : RecyclerView.Adapter<PlayerAdapter.ViewHolder>() {
    class ViewHolder(ItemView: View) : RecyclerView.ViewHolder(ItemView) {
        val playerName: TextView = itemView.findViewById(R.id.playerName)
        val playerType: TextView = itemView.findViewById(R.id.playerType)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.card_view_design, parent, false)
        return ViewHolder(view)
    }

    override fun getItemCount(): Int {
        return data.size
    }

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val itemsViewModel = data[position]

        // sets the text to the textview from our itemHolder class
        Timber.d("MM onBindViewHolder ${data.size}")
        holder.playerName.text = itemsViewModel.firstName + " " + itemsViewModel.secondName
        holder.playerType.text = itemsViewModel.elementType.toString()
    }
}

