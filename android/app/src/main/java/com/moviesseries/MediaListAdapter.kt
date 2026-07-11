package com.moviesseries

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView

class MediaListAdapter(
    private val isHorizontalCard: Boolean,
    private val isGrid: Boolean,
    private val onItemClick: (TMDBMedia) -> Unit
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    private var items: List<TMDBMedia> = emptyList()

    fun submitList(newItems: List<TMDBMedia>) {
        items = newItems
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return if (isHorizontalCard) {
            HorizontalMediaCardViewHolder.create(parent, isGrid)
        } else {
            VerticalMediaCardViewHolder.create(parent, isGrid)
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val item = items[position]
        if (holder is HorizontalMediaCardViewHolder) {
            holder.bind(item)
        } else if (holder is VerticalMediaCardViewHolder) {
            holder.bind(item)
        }
        holder.itemView.setOnClickListener {
            onItemClick(item)
        }
    }

    override fun getItemCount(): Int = items.size
}
