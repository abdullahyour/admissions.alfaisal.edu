// ملف JavaScript الأساسي لبوابة القبول والتسجيل - جامعة الفيصل

// تهيئة الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إضافة تأثيرات التحريك للعناصر
    addScrollAnimations();
    
    // تهيئة النماذج
    initializeForms();
    
    // إضافة تأثيرات التفاعل
    addInteractiveEffects();
    
    // تحديث التاريخ الحالي
    updateCurrentDate();
});

// إضافة تأثيرات التحريك عند التمرير
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // مراقبة العناصر القابلة للتحريك
    const animatedElements = document.querySelectorAll('.service-card, .info-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// تهيئة النماذج
function initializeForms() {
    // نموذج الاستعلام
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquirySubmission);
    }

    // نموذج تأكيد القبول
    const confirmationForm = document.getElementById('confirmationForm');
    if (confirmationForm) {
        confirmationForm.addEventListener('submit', handleConfirmationSubmission);
    }

    // إضافة تأثيرات للحقول
    const formInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.style.borderColor = '#4a90e2';
            this.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.style.borderColor = '#e9ecef';
            this.style.boxShadow = 'none';
        });

        input.addEventListener('input', function() {
            validateField(this);
        });
    });
}

// معالجة نموذج الاستعلام
function handleInquirySubmission(e) {
    e.preventDefault();
    
    const applicationId = document.getElementById('applicationId').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const phone = document.getElementById('phone').value.trim();
    
    // عرض رسالة التحميل
    showLoadingMessage();
    
    // محاكاة استعلام قاعدة البيانات
    setTimeout(() => {
        hideLoadingMessage();
        
        // فحص البيانات المدخلة
        if (isValidStudent(applicationId, email, phone)) {
            showStudentResult();
        } else {
            showNotFoundMessage();
        }
    }, 2000);
}

// فحص صحة بيانات الطالبة
function isValidStudent(applicationId, email, phone) {
    return (applicationId === 'ADM-2024-1547' || applicationId === '1234567890') && 
           email === 'hmaysale.93sh@gmail.com' && 
           phone === '0567667702';
}

// عرض نتيجة الطالبة المقبولة
function showStudentResult() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // إضافة تأثير الظهور
        setTimeout(() => {
            resultsSection.style.opacity = '1';
            resultsSection.style.transform = 'translateY(0)';
        }, 100);
    }
}

// عرض رسالة عدم العثور على البيانات
function showNotFoundMessage() {
    const message = `
        <div class="alert alert-warning" style="background: #fff3cd; border: 2px solid #ffeaa7; border-radius: 12px; padding: 20px; margin-top: 20px; text-align: center;">
            <h4 style="color: #856404; margin-bottom: 15px;">لم يتم العثور على طلب</h4>
            <p style="color: #856404; margin-bottom: 15px;">عذراً، لم يتم العثور على طلب بالبيانات المدخلة.</p>
            <p style="color: #856404; font-size: 0.9rem;">يرجى التأكد من صحة البيانات والمحاولة مرة أخرى، أو التواصل مع عمادة القبول والتسجيل.</p>
        </div>
    `;
    
    const container = document.querySelector('.inquiry-container');
    const existingAlert = container.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    container.insertAdjacentHTML('beforeend', message);
    container.lastElementChild.scrollIntoView({ behavior: 'smooth' });
}

// معالجة نموذج تأكيد القبول
function handleConfirmationSubmission(e) {
    e.preventDefault();
    
    const acceptTerms = document.getElementById('acceptTerms').checked;
    const signature = document.getElementById('signature').value.trim();
    
    if (!acceptTerms) {
        alert('يرجى الموافقة على الشروط والأحكام');
        return;
    }
    
    if (!signature) {
        alert('يرجى إدخال التوقيع الإلكتروني');
        return;
    }
    
    // إنشاء رقم مرجعي
    const refNumber = generateReferenceNumber('CONF');
    const currentDateTime = new Date().toLocaleString('ar-SA');
    
    // تحديث معلومات المرجع
    document.getElementById('referenceNumber').textContent = refNumber;
    document.getElementById('confirmDateTime').textContent = currentDateTime;
    
    // إخفاء النموذج وعرض رسالة النجاح
    document.getElementById('confirmationForm').style.display = 'none';
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth' });
}

// إنشاء رقم مرجعي
function generateReferenceNumber(prefix) {
    const year = new Date().getFullYear();
    const randomString = Math.random().toString(36).substr(2, 8).toUpperCase();
    return `${prefix}-${year}-${randomString}`;
}

// عرض رسالة التحميل
function showLoadingMessage() {
    const loadingHTML = `
        <div id="loadingMessage" class="loading-overlay" style="
            position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
            background: rgba(0,0,0,0.5); z-index: 9999; 
            display: flex; align-items: center; justify-content: center;
        ">
            <div style="
                background: white; padding: 40px; border-radius: 16px; 
                text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <div class="spinner" style="
                    width: 50px; height: 50px; border: 4px solid #f3f3f3; 
                    border-top: 4px solid #4a90e2; border-radius: 50%; 
                    animation: spin 1s linear infinite; margin: 0 auto 20px;
                "></div>
                <p style="color: #1e3a5f; font-weight: 600; margin: 0;">جاري البحث في قاعدة البيانات...</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

// إخفاء رسالة التحميل
function hideLoadingMessage() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// إضافة تأثيرات التفاعل
function addInteractiveEffects() {
    // تأثيرات الأزرار
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px)';
        });
    });

    // تأثيرات البطاقات
    const cards = document.querySelectorAll('.service-card, .info-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
        });
    });

    // تأثير التمرير السلس للروابط
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// التحقق من صحة الحقول
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // إزالة رسائل الخطأ السابقة
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // التحقق حسب نوع الحقل
    switch (fieldType) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
            }
            break;
        
        case 'tel':
            const phoneRegex = /^(05|5)[0-9]{8}$/;
            if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'يرجى إدخال رقم هاتف صحيح (05xxxxxxxx)';
            }
            break;
        
        case 'text':
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'هذا الحقل مطلوب';
            }
            break;
    }

    // عرض رسالة الخطأ إذا لزم الأمر
    if (!isValid && errorMessage) {
        const errorElement = document.createElement('small');
        errorElement.className = 'error-message';
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '5px';
        errorElement.style.display = 'block';
        errorElement.textContent = errorMessage;
        field.parentElement.appendChild(errorElement);
        
        field.style.borderColor = '#dc3545';
    } else {
        field.style.borderColor = isValid ? '#28a745' : '#e9ecef';
    }

    return isValid;
}

// تحديث التاريخ الحالي
function updateCurrentDate() {
    const dateInputs = document.querySelectorAll('input[type="date"][readonly]');
    const currentDate = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.value = currentDate;
    });
}

// وظائف مساعدة للطباعة
function printPage() {
    window.print();
}

// وظائف مساعدة لنسخ النص
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('تم النسخ بنجاح!', 'success');
        }).catch(function() {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// نسخ النص (طريقة احتياطية)
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('تم النسخ بنجاح!', 'success');
    } catch (err) {
        showNotification('فشل في النسخ', 'error');
    }
    
    document.body.removeChild(textArea);
}

// عرض الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        padding: 15px 20px; border-radius: 8px; color: white;
        font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transform: translateX(100%); transition: transform 0.3s ease;
    `;
    
    // تحديد لون الإشعار
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#212529';
            break;
        default:
            notification.style.backgroundColor = '#17a2b8';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // إخفاء الإشعار
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// إضافة CSS للتحريك
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .focused {
        transform: scale(1.02);
        transition: transform 0.2s ease;
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// تصدير الوظائف للاستخدام العام
window.alfaisalPortal = {
    copyToClipboard,
    printPage,
    showNotification,
    generateReferenceNumber
};

