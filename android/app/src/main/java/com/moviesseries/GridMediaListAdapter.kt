package com.moviesseries

import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter

class GridMediaListAdapter(
    private val onItemClick: (TMDBMedia) -> Unit
) : ListAdapter<TMDBMedia, GridMediaCardViewHolder>(MediaDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): GridMediaCardViewHolder {
        return GridMediaCardViewHolder.create(parent)
    }

    override fun onBindViewHolder(holder: GridMediaCardViewHolder, position: Int) {
        val item = getItem(position)
        holder.bind(item)
        holder.itemView.setOnClickListener {
            onItemClick(item)
        }
    }

    class MediaDiffCallback : DiffUtil.ItemCallback<TMDBMedia>() {
        override fun areItemsTheSame(oldItem: TMDBMedia, newItem: TMDBMedia): Boolean {
            return oldItem.id == newItem.id && oldItem.mediaType == newItem.mediaType
        }

        override fun areContentsTheSame(oldItem: TMDBMedia, newItem: TMDBMedia): Boolean {
            return oldItem == newItem
        }
    }
}
