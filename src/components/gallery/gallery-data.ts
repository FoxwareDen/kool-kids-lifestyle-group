import churchImg from '../../images/church.jpeg'
import church2Img from '../../images/church-2.jpeg'
import karooImg from '../../images/karoo.jpeg'
import karoo2Img from '../../images/karoo-2.jpeg'
import koppieImg from '../../images/koppie.jpeg'
import orangeRiverImg from '../../images/orange-river.jpeg'
import prieskaImg from '../../images/prieska.jpeg'
import riverImg from '../../images/river.jpeg'
import river3Img from '../../images/river3.jpeg'
import trailImg from '../../images/trail.jpeg'

/**
 * The set of categories used to filter the gallery. "all" is a virtual
 * category that matches every photo.
 * @typedef {'all' | 'river' | 'town' | 'landscape' | 'trails'} GalleryCategory
 */
export type GalleryCategory = 'all' | 'river' | 'town' | 'landscape' | 'trails'

/**
 * A single photograph displayed in the gallery.
 * @typedef {Object} GalleryPhoto
 * @property {string} id - Stable unique identifier for the photo.
 * @property {string} image - Imported image source path.
 * @property {string} alt - Accessible description of the photo.
 * @property {string} title - Short human-readable title shown on hover/lightbox.
 * @property {Exclude<GalleryCategory, 'all'>} category - Category the photo belongs to.
 */
export type GalleryPhoto = {
  id: string
  image: string
  alt: string
  title: string
  category: Exclude<GalleryCategory, 'all'>
}

/**
 * A selectable filter shown above the gallery grid.
 * @typedef {Object} GalleryFilterOption
 * @property {GalleryCategory} value - Category this filter selects.
 * @property {string} label - Visible label for the filter button.
 */
export type GalleryFilterOption = {
  value: GalleryCategory
  label: string
}

/**
 * Ordered list of filter options rendered by the gallery filter bar.
 * @type {GalleryFilterOption[]}
 */
export const GALLERY_FILTERS: GalleryFilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'river', label: 'River' },
  { value: 'town', label: 'Town & Heritage' },
  { value: 'landscape', label: 'Landscapes' },
  { value: 'trails', label: 'Trails & Adventure' },
]

/**
 * Static gallery photographs. Replace with CMS-driven content when wiring up
 * live data from PocketBase.
 * @type {GalleryPhoto[]}
 */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'orange-river',
    image: orangeRiverImg,
    alt: 'Orange River lined with palm trees at golden hour',
    title: 'Orange River at Golden Hour',
    category: 'river',
  },
  {
    id: 'church',
    image: churchImg,
    alt: 'Historic church steeple framed by palm trees',
    title: 'The Old Church',
    category: 'town',
  },
  {
    id: 'koppie',
    image: koppieImg,
    alt: 'Koppie hill rising over the Karoo plains',
    title: "Tiger's-Eye Koppie",
    category: 'landscape',
  },
  {
    id: 'river3',
    image: river3Img,
    alt: 'Calm bend of the river reflecting the sky',
    title: 'A Quiet River Bend',
    category: 'river',
  },
  {
    id: 'prieska',
    image: prieskaImg,
    alt: 'Street view of the town of Prieska',
    title: 'Streets of Prieska',
    category: 'town',
  },
  {
    id: 'trail',
    image: trailImg,
    alt: 'Hiking trail winding through the veld',
    title: 'Veld Hiking Trail',
    category: 'trails',
  },
  {
    id: 'karoo',
    image: karooImg,
    alt: 'Wide open Karoo landscape under a vast sky',
    title: 'Endless Karoo Sky',
    category: 'landscape',
  },
  {
    id: 'church-2',
    image: church2Img,
    alt: 'Stone heritage building in the town centre',
    title: 'Heritage Stonework',
    category: 'town',
  },
  {
    id: 'river',
    image: riverImg,
    alt: 'Sunlight glinting across the Orange River',
    title: 'River Light',
    category: 'river',
  },
  {
    id: 'karoo-2',
    image: karoo2Img,
    alt: 'Golden Karoo plains stretching to the horizon',
    title: 'Golden Plains',
    category: 'landscape',
  },
]
