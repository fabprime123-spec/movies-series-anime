package com.moviesseries

import android.graphics.Color
import android.view.ViewGroup
import android.widget.ImageView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import coil.load

class GridMediaCardViewHolder(
    private val cardView: CardView,
    private val posterImage: ImageView
) : RecyclerView.ViewHolder(cardView) {

    fun bind(item: TMDBMedia) {
        val params = cardView.layoutParams
        if (params is ViewGroup.MarginLayoutParams) {
            params.width = ViewGroup.LayoutParams.MATCH_PARENT
            // Margin 0. Spacing is handled by ItemDecoration
            params.setMargins(0, 0, 0, 0)
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
        fun create(parent: ViewGroup): GridMediaCardViewHolder {
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

            return GridMediaCardViewHolder(cardView, imageView)
        }
    }
}
