/**
 * Scrolls the window to the top of the page
 * @param behavior - The scroll behavior ('auto' | 'smooth')
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

/**
 * Scrolls to top and then navigates to a URL
 * @param url - The URL to navigate to
 * @param behavior - The scroll behavior before navigation
 */
export const scrollToTopAndNavigate = (url: string, behavior: ScrollBehavior = 'smooth') => {
  scrollToTop(behavior);
  // Small delay to ensure scroll completes before navigation
  setTimeout(() => {
    window.location.href = url;
  }, 100);
};
