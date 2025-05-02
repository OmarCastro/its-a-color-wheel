/**
 * @param {Point} point1 - target point
 * @param {Point} point2 - the other point
 * @returns {number} distance between `point1` and `point2`
 */
export const calculateDistanceBetween2Points = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

export const CircleInfo = {
  /**
   * @param {Rect} rect - bounding box to fill the disk
   * @param {number} innerRadiusPerc - The `Disk` inner circle radius percentage, or the hole radius percentage
   * @returns {Disk} built `Disk` object
   */
  fromRectWithPercentInnerRadius (rect, innerRadiusPerc) {
    const { x, y, width, height } = rect
    const radius = Math.min(width, height) / 2
    const innerRadius = (innerRadiusPerc * 0.01) * radius
    const center = { x: x + width / 2, y: y + height / 2 }
    return { innerRadiusPerc, radius, innerRadius, center }
  },
  /**
   * @param {Rect} rect - bounding box to fill the disk
   * @param {number} innerRadius - The `Disk` inner circle radius, or the hole radius
   * @returns {Disk} built `Disk` object
   */
  fromRectWithInnerRadius (rect, innerRadius) {
    const { x, y, width, height } = rect
    const radius = Math.min(width, height) / 2
    const innerRadiusPerc = innerRadius * 100 / radius
    const center = { x: x + width / 2, y: y + height / 2 }
    return { innerRadiusPerc, radius, innerRadius, center }
  },
}

/**
 * @typedef {object} Point
 * An object that represents a 2D point in a coordinate system
 * @property {number} x - the `x` coordinate of the `Point`
 * @property {number} y - the `y` coordinate of the `Point`
 */

/**
 * @typedef {object} Rect
 * An object that represents rectange
 * @property {number} x - The `x` coordinate of the `Rect`'s origin point (typically the top-left corner of the rectangle).
 * @property {number} y - The `y` coordinate of the `Rect`'s origin point (typically the top-left corner of the rectangle).
 * @property {number} width - The width of the `Rect`.
 * @property {number} height - The width of the `Rect`.
 */

/**
 * @typedef {object} Disk
 * An object that represents a circle with an hole in the center
 * @property {number} radius - The `Disk` outer circle radius
 * @property {Point} center - The coordinates of the `Disk` center
 * @property {number} innerRadius - The `Disk` inner circle radius, or the hole radius
 * @property {number} innerRadiusPerc - relative percentage of `innerRadius` compared to `radius`
 */
