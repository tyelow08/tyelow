// ==================== CAROUSEL MÀN HÌNH TRƯNG BÀY (KÉO MƯỢT + QUÁN TÍNH) ====================
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const prevBtn = carousel.querySelector('.prev-arrow');
        const nextBtn = carousel.querySelector('.next-arrow');

        let momentumID; // Biến lưu vòng lặp quán tính

        // 1. Chức năng bấm nút mũi tên
        if (prevBtn && nextBtn && track) {
            const scrollAmount = 300; 
            
            prevBtn.addEventListener('click', () => {
                cancelAnimationFrame(momentumID); // Dừng trượt quán tính (nếu đang chạy)
                track.style.scrollBehavior = 'smooth';
                track.scrollBy({ left: -scrollAmount });
            });

            nextBtn.addEventListener('click', () => {
                cancelAnimationFrame(momentumID); 
                track.style.scrollBehavior = 'smooth';
                track.scrollBy({ left: scrollAmount });
            });
        }

        // 2. Chức năng Dùng chuột kéo + QUÁN TÍNH
        let isDown = false;
        let startX;
        let scrollLeft;
        let isDragging = false; 
        let velX = 0; // Lưu trữ vận tốc vẩy chuột

        const preventNativeDrag = (e) => e.preventDefault();
        track.querySelectorAll('img, a').forEach(el => {
            el.addEventListener('dragstart', preventNativeDrag);
        });

        // HÀM TẠO QUÁN TÍNH TRƯỢT 
        const applyMomentum = () => {
            if (isDown) return; // Nếu đang giữ chuột thì không trượt tự động
            
            track.scrollLeft -= velX;
            velX *= 0.92; // Hệ số ma sát (Số càng gần 1 trượt càng xa, 0.92 là vừa độ đầm tay)

            // Nếu vận tốc vẫn còn đủ lớn thì tiếp tục lặp lại hiệu ứng trượt
            if (Math.abs(velX) > 0.5) {
                momentumID = requestAnimationFrame(applyMomentum);
            } else {
                track.style.scrollBehavior = 'smooth'; // Phục hồi cuộn mượt khi xe đã dừng hẳn
            }
        };

        // KHI NHẤN CHUỘT
        track.addEventListener('mousedown', (e) => {
            isDown = true;
            isDragging = false;
            track.style.cursor = 'grabbing';
            track.style.scrollBehavior = 'auto'; // Tắt cuộn mượt để thẻ dính chặt vào tay
            
            cancelAnimationFrame(momentumID); // Chạm tay vào là băng chuyền phải dừng lại ngay
            velX = 0; // Reset tốc độ
            
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        // KHI THẢ CHUỘT (Ở BẤT KỲ ĐÂU)
        window.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            track.style.cursor = 'grab';
            applyMomentum(); // BẮT ĐẦU TRƯỢT QUÁN TÍNH
        });

        // KHI VĂNG CHUỘT RA KHỎI KHUNG KÉO
        track.addEventListener('mouseleave', () => {
            if (!isDown) return;
            isDown = false;
            track.style.cursor = 'grab';
            applyMomentum(); // BẮT ĐẦU TRƯỢT QUÁN TÍNH
        });

        // KHI ĐANG KÉO CHUỘT
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); 
            isDragging = true; 
            
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5; 
            
            // Tính toán vận tốc (Khoảng cách giữa frame trước và frame hiện tại)
            const prevScrollLeft = track.scrollLeft;
            track.scrollLeft = scrollLeft - walk;
            velX = prevScrollLeft - track.scrollLeft; 
        });

        // CHẶN BẤM NHẦM KHI KÉO
        track.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault(); 
                e.stopPropagation();
            }
        });
        
        track.style.cursor = 'grab';
    });
});