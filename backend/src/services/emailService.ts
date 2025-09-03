import nodemailer from 'nodemailer';

// 📧 Email Interface
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// 📧 Email Templates Interface
interface EmailTemplateData {
  [key: string]: any;
}

// 🎯 Email Service Class
class EmailService {
  private transporter: nodemailer.Transporter;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      // Check if email configuration exists
      if (!process.env.EMAIL_FROM) {
        console.warn('⚠️ Email konfigürasyonu bulunamadı, email gönderimi devre dışı');
        return;
      }

      // For development - use Ethereal Email (fake SMTP)
      if (process.env.NODE_ENV === 'development') {
        this.transporter = nodemailer.createTransporter({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: 'ethereal.user@ethereal.email', // Generated ethereal user
            pass: 'ethereal.pass' // Generated ethereal password
          }
        });
      } else {
        // Production - use real SMTP (SendGrid, Gmail, etc.)
        this.transporter = nodemailer.createTransporter({
          service: 'gmail', // or your email service
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      }

      this.isConfigured = true;
      console.log('✅ Email servisi yapılandırıldı');

    } catch (error) {
      console.error('❌ Email servisi yapılandırma hatası:', error);
      this.isConfigured = false;
    }
  }

  // 📤 Send email
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('⚠️ Email servisi yapılandırılmamış, email gönderilemiyor');
      return false;
    }

    try {
      const mailOptions = {
        from: `"Lezzet Durağı" <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Test email URL:', nodemailer.getTestMessageUrl(result));
      }

      console.log(`✅ Email gönderildi: ${options.to}`);
      return true;

    } catch (error) {
      console.error('❌ Email gönderme hatası:', error);
      return false;
    }
  }

  // 🧹 Strip HTML tags for plain text
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  // 🎨 Generate email template
  private generateTemplate(title: string, content: string, actionUrl?: string, actionText?: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ea580c; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #ea580c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍽️ Lezzet Durağı</h1>
            </div>
            <div class="content">
                <h2>${title}</h2>
                ${content}
                ${actionUrl && actionText ? `<p><a href="${actionUrl}" class="button">${actionText}</a></p>` : ''}
            </div>
            <div class="footer">
                <p>Bu email Lezzet Durağı tarafından gönderilmiştir.</p>
                <p>Mersin, Türkiye | support@lezzetduragi.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // ✅ Email verification email
  async sendVerificationEmail(email: string, verificationUrl: string): Promise<boolean> {
    const content = `
      <p>Lezzet Durağı'na hoş geldiniz!</p>
      <p>E-posta adresinizi doğrulamak için aşağıdaki butona tıklayın:</p>
      <p>Bu bağlantının geçerlilik süresi 24 saattir.</p>
    `;

    const html = this.generateTemplate(
      'E-posta Adresinizi Doğrulayın',
      content,
      verificationUrl,
      'E-postamı Doğrula'
    );

    return await this.sendEmail({
      to: email,
      subject: 'Lezzet Durağı - E-posta Doğrulama',
      html
    });
  }

  // 🔐 Password reset email
  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<boolean> {
    const content = `
      <p>Şifre sıfırlama isteği aldık.</p>
      <p>Yeni şifre oluşturmak için aşağıdaki butona tıklayın:</p>
      <p>Bu bağlantının geçerlilik süresi 10 dakikadır.</p>
      <p>Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
    `;

    const html = this.generateTemplate(
      'Şifre Sıfırlama',
      content,
      resetUrl,
      'Şifremi Sıfırla'
    );

    return await this.sendEmail({
      to: email,
      subject: 'Lezzet Durağı - Şifre Sıfırlama',
      html
    });
  }

  // 🛒 Order confirmation email
  async sendOrderConfirmationEmail(email: string, orderData: any): Promise<boolean> {
    const content = `
      <p>Siparişiniz başarıyla alındı!</p>
      <p><strong>Sipariş No:</strong> #${orderData.orderNumber}</p>
      <p><strong>Toplam Tutar:</strong> ₺${orderData.totalAmount}</p>
      <p><strong>Teslimat Adresi:</strong> ${orderData.deliveryAddress}</p>
      <p>Siparişinizin durumunu takip edebilirsiniz.</p>
    `;

    const html = this.generateTemplate(
      'Sipariş Onayı',
      content,
      `${process.env.FRONTEND_URL}/orders/${orderData.orderId}`,
      'Siparişimi Takip Et'
    );

    return await this.sendEmail({
      to: email,
      subject: `Lezzet Durağı - Sipariş Onayı #${orderData.orderNumber}`,
      html
    });
  }

  // 🚚 Order status update email
  async sendOrderStatusEmail(email: string, orderData: any): Promise<boolean> {
    const statusMessages: { [key: string]: string } = {
      'confirmed': 'Siparişiniz onaylandı ve hazırlanmaya başlandı',
      'preparing': 'Siparişiniz hazırlanıyor',
      'ready': 'Siparişiniz hazır ve teslimat için bekliyor',
      'out-for-delivery': 'Siparişiniz yola çıktı',
      'delivered': 'Siparişiniz teslim edildi',
      'cancelled': 'Siparişiniz iptal edildi'
    };

    const content = `
      <p><strong>Sipariş No:</strong> #${orderData.orderNumber}</p>
      <p><strong>Durum:</strong> ${statusMessages[orderData.status] || orderData.status}</p>
      <p>Sipariş detaylarını görüntülemek için aşağıdaki butona tıklayın.</p>
    `;

    const html = this.generateTemplate(
      'Sipariş Durumu Güncellendi',
      content,
      `${process.env.FRONTEND_URL}/orders/${orderData.orderId}`,
      'Sipariş Detayları'
    );

    return await this.sendEmail({
      to: email,
      subject: `Lezzet Durağı - Sipariş Durumu: #${orderData.orderNumber}`,
      html
    });
  }

  // 🎉 Welcome email for new users
  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    const content = `
      <p>Merhaba ${firstName}!</p>
      <p>Lezzet Durağı ailesine hoş geldiniz! 🎉</p>
      <p>Artık lezzetli döner, makarna ve daha fazlasını kolayca sipariş edebilirsiniz.</p>
      <p>İlk siparişinizde %10 indirim kazanmak için menümüzü inceleyin!</p>
    `;

    const html = this.generateTemplate(
      'Hoş Geldiniz!',
      content,
      `${process.env.FRONTEND_URL}/menu`,
      'Menüyü İncele'
    );

    return await this.sendEmail({
      to: email,
      subject: 'Lezzet Durağı\'na Hoş Geldiniz! 🍽️',
      html
    });
  }

  // 📊 Test email connectivity
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email bağlantısı başarılı');
      return true;
    } catch (error) {
      console.error('❌ Email bağlantı testi başarısız:', error);
      return false;
    }
  }
}

// 🚀 Export singleton instance
export const emailService = new EmailService();

// 🔧 Export for testing
export { EmailService };