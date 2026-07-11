package com.moviesseries

import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.text.TextUtils
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import coil.load

class HorizontalMediaCardViewHolder(
    private val cardView: CardView,
    private val posterImage: ImageView,
    private val titleText: TextView,
    private val ratingText: TextView,
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
                params.width = (240 * density).toInt()
                val rightMargin = (12 * density).toInt()
                params.setMargins(0, 0, rightMargin, 0)
            }
            cardView.layoutParams = params
        }

        titleText.text = item.title
        val ratingFormatted = String.format("%.1f", item.voteAverage)
        ratingText.text = ratingFormatted

        val imagePath = if (item.backdropPath.isNotEmpty()) item.backdropPath else item.posterPath

        if (imagePath.isNotEmpty()) {
            val imageUrl = "https://image.tmdb.org/t/p/w500${imagePath}"
            posterImage.load(imageUrl) {
                crossfade(true)
                allowHardware(false)
            }
        } else {
            posterImage.setImageDrawable(null)
        }
    }

    companion object {
        fun create(parent: ViewGroup, isGrid: Boolean): HorizontalMediaCardViewHolder {
            val context = parent.context
            val density = context.resources.displayMetrics.density

            val cardView = CardView(context)
            cardView.layoutParams = ViewGroup.MarginLayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            cardView.radius = 12 * density
            cardView.cardElevation = 0f
            cardView.setCardBackgroundColor(Color.parseColor("#1e1e1e"))

            val rootLayout = LinearLayout(context)
            rootLayout.orientation = LinearLayout.VERTICAL
            rootLayout.layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )

            // Custom ImageView for 16:9 Aspect Ratio
            val posterImage = object : ImageView(context) {
                override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
                    val width = MeasureSpec.getSize(widthMeasureSpec)
                    val height = (width * 9f / 16f).toInt()
                    val newHeightSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
                    super.onMeasure(widthMeasureSpec, newHeightSpec)
                }
            }
            posterImage.layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT // will be overridden by onMeasure
            )
            posterImage.scaleType = ImageView.ScaleType.CENTER_CROP
            rootLayout.addView(posterImage)

            val infoContainer = LinearLayout(context)
            infoContainer.orientation = LinearLayout.HORIZONTAL
            infoContainer.layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            val padding = (12 * density).toInt()
            infoContainer.setPadding(padding, padding, padding, padding)
            infoContainer.gravity = Gravity.CENTER_VERTICAL

            val titleText = TextView(context)
            val titleParams = LinearLayout.LayoutParams(
                0,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                1f
            )
            titleText.layoutParams = titleParams
            titleText.ellipsize = TextUtils.TruncateAt.END
            titleText.maxLines = 1
            titleText.textSize = 14f
            titleText.setTypeface(null, Typeface.BOLD)
            titleText.setTextColor(Color.parseColor("#FFFFFF"))
            infoContainer.addView(titleText)

            val ratingRow = LinearLayout(context)
            ratingRow.orientation = LinearLayout.HORIZONTAL
            ratingRow.gravity = Gravity.CENTER_VERTICAL
            val ratingRowParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            ratingRowParams.marginStart = (8 * density).toInt()
            ratingRow.layoutParams = ratingRowParams

            val starIcon = ImageView(context)
            val starSize = (12 * density).toInt()
            starIcon.layoutParams = LinearLayout.LayoutParams(starSize, starSize)
            val starDrawable = context.resources.getDrawable(R.drawable.ic_lucide_star, context.theme)
            starDrawable.setTint(Color.parseColor("#f5c518"))
            starIcon.setImageDrawable(starDrawable)
            ratingRow.addView(starIcon)

            val ratingText = TextView(context)
            val ratingTextParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            ratingTextParams.marginStart = (4 * density).toInt()
            ratingText.layoutParams = ratingTextParams
            ratingText.textSize = 12f
            ratingText.setTextColor(Color.parseColor("#a1a1aa"))
            ratingRow.addView(ratingText)

            infoContainer.addView(ratingRow)
            rootLayout.addView(infoContainer)
            cardView.addView(rootLayout)

            return HorizontalMediaCardViewHolder(cardView, posterImage, titleText, ratingText, isGrid)
        }
    }
}
