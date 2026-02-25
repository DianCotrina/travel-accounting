import { useMemo, useState } from "react";
import type { CategoryCatalogEntry } from "../app/categoryCatalog";
import "./CategoryCatalogPreview.css";

type CategoryCatalogPreviewProps = {
  categories: CategoryCatalogEntry[];
  previewCount?: number;
};

export function CategoryCatalogPreview({
  categories,
  previewCount = 6,
}: CategoryCatalogPreviewProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? "",
  );

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ??
      categories[0],
    [categories, selectedCategoryId],
  );

  if (categories.length === 0) {
    return null;
  }

  return (
    <>
      <label className="landing-category-select">
        Example categories dropdown
        <select
          value={selectedCategory?.id ?? ""}
          onChange={(event) => setSelectedCategoryId(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </label>

      {selectedCategory && (
        <div className="landing-category-selected">
          <span
            className="landing-category-selected__dot"
            style={{ backgroundColor: selectedCategory.accent }}
            aria-hidden="true"
          />
          <div>
            <p>Selected category</p>
            <strong>{selectedCategory.label}</strong>
            {selectedCategory.subcategories &&
              selectedCategory.subcategories.length > 0 && (
                <small>
                  {selectedCategory.subcategories.length} subcategories ready
                </small>
              )}
          </div>
        </div>
      )}

      {selectedCategory?.subcategories &&
        selectedCategory.subcategories.length > 0 && (
          <div
            className="landing-subcategory-preview"
            aria-label="Subcategory preview"
          >
            <p>Subcategories (example)</p>
            <div className="landing-subcategory-preview__chips">
              {selectedCategory.subcategories.map((subcategory) => (
                <span key={subcategory}>{subcategory}</span>
              ))}
            </div>
          </div>
        )}

      <ul
        className="landing-category-list"
        aria-label="Category catalog preview"
      >
        {categories.slice(0, previewCount).map((category) => (
          <li key={category.id}>
            <span
              className="landing-category-list__icon"
              style={{ backgroundColor: category.accent }}
              aria-hidden="true"
            >
              {category.shortCode}
            </span>
            <div className="landing-category-list__text">
              <span>{category.label}</span>
              {category.subcategories && category.subcategories.length > 0 && (
                <small>{category.subcategories.length} subcategories</small>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
