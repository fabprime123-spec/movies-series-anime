package com.moviesseries

import android.content.Context
import android.graphics.Color
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import coil.load

class VerticalMediaCardViewHolder(
    private val cardView: CardView,
    private val posterImage: ImageView,
    private val isGrid: Boolean
) : RecyclerView.ViewHolder(cardView) {

    fun bind(item: TMDBMedia) {
        val params = cardView.layoutParams
        if (params is ViewGroup.MarginLayoutParams) {
            val density = cardView.resources.displayMetrics.density
            if (isGrid) {
                params.width = ViewGroup.LayoutParams.MATCH_PARENT
                val m = (6 * density).toInt()
                params.setMargins(m, m, m, m)
            } else {
                params.width = (112 * density).toInt()
                val rightMargin = (12 * density).toInt()
                params.setMargins(0, 0, rightMargin, 0)
            }
            cardView.layoutParams = params
        }

        if (item.posterPath.isNotEmpty()) {
            val imageUrl = "https://image.tmdb.org/t/p/w342${item.posterPath}"
            posterImage.load(imageUrl) {
                crossfade(true)
                allowHardware(false)
            }
        } else {
            posterImage.setImageDrawable(null)
        }
    }

    companion object {
        fun create(parent: ViewGroup, isGrid: Boolean): VerticalMediaCardViewHolder {
            val context = parent.context
            val density = context.resources.displayMetrics.density

            val cardView = object : CardView(context) {
                override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
                    val width = MeasureSpec.getSize(widthMeasureSpec)
                    // Aspect ratio 2:3 -> height = width * 3 / 2
                    val height = (width * 3f / 2f).toInt()
                    val newHeightSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
                    super.onMeasure(widthMeasureSpec, newHeightSpec)
                }
            }

            // MarginLayoutParams will be applied in bind()
            cardView.layoutParams = ViewGroup.MarginLayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            cardView.radius = 12 * density
            cardView.cardElevation = 0f
            cardView.setCardBackgroundColor(Color.parseColor("#2a2a2a"))

            val imageView = ImageView(context)
            val imgParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            imageView.layoutParams = imgParams
            imageView.scaleType = ImageView.ScaleType.CENTER_CROP
            
            cardView.addView(imageView)

            return VerticalMediaCardViewHolder(cardView, imageView, isGrid)
        }
    }
}
