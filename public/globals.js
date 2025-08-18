// globals.js - 全局 JavaScript 文件
// 這個文件會在所有頁面加載

// 確保在瀏覽器環境中執行
if (typeof window !== 'undefined') {
    // console.log('✅ globals.js 加載完成');
    
    // Function to initialize header scroll effect
    function initHeaderScrollEffect() {
        const header = document.getElementById('header');
        const scrollThreshold = 50; // Adjust as needed
        
        // Check if header element exists
        if (header) {
            // console.log('✅ Header element found, initializing scroll effect');
            
            // Remove existing event listener if any
            window.removeEventListener('scroll', handleScroll);
            
            // Add scroll event listener
            window.addEventListener('scroll', handleScroll);
            
            // Initial check
            handleScroll();
            
            function handleScroll() {
                if (window.scrollY > scrollThreshold) {
                    header.classList.add('scrolled'); // Add shadow when scrolled                    
                } else {
                    header.classList.remove('scrolled'); // Remove shadow when at top                    
                }
            }
        } else {
            //console.warn('⚠️ Header element not found, retrying...');
            // Retry after a short delay
            setTimeout(initHeaderScrollEffect, 100);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderScrollEffect);
    } else {
        // DOM is already ready
        initHeaderScrollEffect();
    }
    
    // Also try to initialize after a delay to catch any late-rendered components
    setTimeout(initHeaderScrollEffect, 500);
}
