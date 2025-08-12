// Preview route configuration for Strapi content types
export const PREVIEW_CONFIG = {
  // Home page - single type
  homepage: {
    type: "single",
    path: "/"
  },
  
  // About page - single type  
  about: {
    type: "single",
    path: "/about"
  },
  
  // Blog posts - collection type
  blog: {
    type: "collection", 
    path: "/blog"
  },
  
  // News articles - collection type
  news: {
    type: "collection",
    path: "/news" 
  },
  
  // Services - collection type
  service: {
    type: "collection",
    path: "/services"
  },
  
  // Projects - collection type
  project: {
    type: "collection", 
    path: "/projects"
  },
  
  // Events - collection type
  event: {
    type: "collection",
    path: "/events"
  },
  
  // Pages - collection type for general pages
  page: {
    type: "collection",
    path: "/pages"
  }
};
