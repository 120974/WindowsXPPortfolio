interface AboutAppProps {
  isDarkMode?: boolean;
}

export default function AboutApp({ isDarkMode = false }: AboutAppProps) {
  const styles = {
    background: isDarkMode 
      ? 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)' 
      : 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
    headerBg: isDarkMode
      ? 'linear-gradient(135deg, #1a4d80 0%, #0f3a5f 100%)'
      : 'linear-gradient(135deg, #4a90e2 0%, #003c71 100%)',
    cardBg: isDarkMode
      ? 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
    text: isDarkMode ? '#e0e0e0' : '#2d3748',
    textSecondary: isDarkMode ? '#a0a0a0' : '#666666',
    border: isDarkMode ? '#2a2a2a' : '#e0e0e0',
    accent: isDarkMode ? '#2563eb' : '#003c71'
  };

  return (
    <div 
      className="h-full overflow-y-auto xp-scrollbar" 
      style={{ 
        fontFamily: 'Tahoma, sans-serif', 
        fontSize: '11px',
        background: styles.background
      }}
    >
      {/* Animated Header Banner */}
      <div 
        className="relative overflow-hidden mb-6"
        style={{
          background: styles.headerBg,
          boxShadow: isDarkMode 
            ? '0 4px 12px rgba(37, 99, 235, 0.3)' 
            : '0 4px 12px rgba(0, 60, 113, 0.2)'
        }}
      >
        {/* Animated Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.1) 10px,
              rgba(255, 255, 255, 0.1) 20px
            )`,
            animation: 'slidePattern 30s linear infinite'
          }}
        />
        
        <div className="relative px-6 py-8 text-center">
          {/* Profile Image with Glow */}
          <div className="mb-4 flex justify-center">
            <div 
              className="relative border-4 shadow-2xl transform transition-transform hover:scale-105" 
              style={{ 
                background: isDarkMode
                  ? 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)',
                borderColor: isDarkMode ? '#2563eb' : '#4a90e2',
                borderRadius: '12px',
                padding: '6px',
                boxShadow: isDarkMode
                  ? '0 0 30px rgba(37, 99, 235, 0.5)'
                  : '0 8px 24px rgba(74, 144, 226, 0.3)'
              }}
            >
              {/* Animated border glow */}
              <div 
                className="absolute inset-0 rounded-xl opacity-50"
                style={{
                  background: `linear-gradient(45deg, 
                    ${isDarkMode ? '#2563eb' : '#4a90e2'} 0%, 
                    ${isDarkMode ? '#7c3aed' : '#667eea'} 50%, 
                    ${isDarkMode ? '#2563eb' : '#4a90e2'} 100%)`,
                  filter: 'blur(10px)',
                  animation: 'pulse 3s ease-in-out infinite'
                }}
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1zc6iwd4YSDRm9EXujSdrwWbedEXWRqic"
                alt="Rishith Chintala"
                className="relative block"
                style={{ 
                  width: '180px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: `2px solid ${isDarkMode ? '#1a1a1a' : '#cccccc'}`
                }}
              />
            </div>
          </div>
          
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ 
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            Rishith Chintala
          </h1>
          <p className="text-base" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Student · Photographer · Designer
          </p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mt-4">
            {[
              { label: 'Mediums', value: '5+' },
              { label: 'Projects', value: '10+' },
              { label: 'Skills', value: '15+' }
            ].map((stat, i) => (
              <div 
                key={i}
                className="px-4 py-2 border-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="text-lg font-bold" style={{ color: '#ffffff' }}>{stat.value}</div>
                <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* About Me Section with Card */}
        <div 
          className="mb-6 p-5 border-2 shadow-lg"
          style={{
            background: styles.cardBg,
            borderColor: styles.border,
            borderRadius: '8px',
            boxShadow: isDarkMode 
              ? '0 4px 8px rgba(0, 0, 0, 0.8)' 
              : '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 
            className="text-lg font-semibold mb-4 flex items-center gap-2" 
            style={{ color: styles.accent }}
          >
            <span className="text-xl">👋</span>
            About Me
          </h2>
          
          <div className="space-y-3" style={{ color: styles.text }}>
            <p className="text-sm leading-relaxed">
              Hi! I'm Rishith Chintala, a high school student at Lambert High School with a passion for 
              technology, design, and creative problem-solving. I'm currently pursuing pathways in 
              Marketing, Business, and Engineering while actively participating in robotics and 
              technology student organizations.
            </p>
            
            <p className="text-sm leading-relaxed">
              I created this Windows XP Portfolio as a tribute to the classic Windows XP operating system while 
              showcasing my professional work and projects. This interactive experience combines my love for 
              retro technology aesthetics with a comprehensive portfolio presentation.
            </p>

            <p className="text-sm leading-relaxed">
              Outside of coding and design work, I enjoy taking photos, developing marketing campaigns for 
              Lambert Robotics, and continuously expanding my skill set in emerging technologies, UI/UX design, 
              and digital media.
            </p>
          </div>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {[
            {
              icon: '🎓',
              title: 'Education',
              color: isDarkMode ? '#2563eb' : '#4a90e2',
              content: 'Currently at Lambert High School (Class of 2026) with a 3.86 GPA, focusing on Marketing & Entrepreneurship, Banking & Insurance, and Engineering Concepts.'
            },
            {
              icon: '💼',
              title: 'Work Experience',
              color: isDarkMode ? '#22c55e' : '#10b981',
              items: [
                'Lambert Engineering: Student & Intern learning engineering concepts and 3D printing',
                'LaundroLab: Marketing Intern working on business development and social media',
                'For more professional experience, check out my LinkedIn'
              ],
              linkedInLink: true
            },
            {
              icon: '🏆',
              title: 'Extracurriculars',
              color: isDarkMode ? '#f59e0b' : '#f97316',
              items: [
                'Lambert Robotics: Marketing Team Member and Teacher',
                'Lambert DECA: Competitor in Marketing and Business',
                'For more information, check out my LinkedIn'
              ],
              linkedInLink: true
            }
          ].map((section, i) => (
            <div
              key={i}
              className="p-4 border-2 shadow-md transform transition-transform hover:scale-[1.02]"
              style={{
                background: styles.cardBg,
                borderColor: section.color,
                borderRadius: '8px',
                borderLeftWidth: '4px',
                boxShadow: isDarkMode 
                  ? `0 2px 8px rgba(0, 0, 0, 0.8)` 
                  : `0 2px 8px ${section.color}20`
              }}
            >
              <h3 
                className="text-base font-semibold mb-3 flex items-center gap-2"
                style={{ color: section.color }}
              >
                <span className="text-xl">{section.icon}</span>
                {section.title}
              </h3>
              {section.content ? (
                <p className="text-sm leading-relaxed" style={{ color: styles.text }}>
                  {section.content}
                </p>
              ) : (
                <ul className="space-y-2">
                  {section.items?.map((item, j) => {
                    const isLinkedInItem = section.linkedInLink && item.toLowerCase().includes('linkedin');
                    return (
                      <li key={j} className="text-sm flex items-start gap-2" style={{ color: styles.text }}>
                        <span style={{ color: section.color }}>▸</span>
                        {isLinkedInItem ? (
                          <a 
                            href="https://www.linkedin.com/in/rishith-chintala-012553232"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            style={{ color: section.color }}
                          >
                            {item}
                          </a>
                        ) : (
                          <span>{item}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Skills Grid with Icons */}
        <div 
          className="mb-6 p-5 border-2 shadow-lg"
          style={{
            background: styles.cardBg,
            borderColor: styles.border,
            borderRadius: '8px',
            boxShadow: isDarkMode 
              ? '0 4px 8px rgba(0, 0, 0, 0.8)' 
              : '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 
            className="text-lg font-semibold mb-4 flex items-center gap-2" 
            style={{ color: styles.accent }}
          >
            <span className="text-xl">⚡</span>
            Skills & Expertise
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: 'Design & Creative',
                icon: '🎨',
                color: isDarkMode ? '#ec4899' : '#e91e63',
                skills: ['Adobe Photoshop & Illustrator', 'Canva & Design Systems', '3D Modeling (Blender, SolidWorks)', 'Marketing Materials & Branding']
              },
              {
                title: 'Technology & Development',
                icon: '💻',
                color: isDarkMode ? '#8b5cf6' : '#9333ea',
                skills: ['JavaScript, C++, Python', 'Unity & Unreal Game Engines', '3D Printing & Woodworking', 'Web Development']
              }
            ].map((category, i) => (
              <div
                key={i}
                className="p-4 border-2"
                style={{
                  background: isDarkMode ? '#0a0a0a' : '#ffffff',
                  borderColor: category.color,
                  borderRadius: '6px'
                }}
              >
                <h4 
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: category.color }}
                >
                  <span>{category.icon}</span>
                  {category.title}
                </h4>
                <ul className="space-y-1.5">
                  {category.skills.map((skill, j) => (
                    <li 
                      key={j} 
                      className="text-xs flex items-center gap-1"
                      style={{ color: styles.text }}
                    >
                      <span style={{ color: category.color }}>✓</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Cards */}
        <div 
          className="mb-6 p-5 border-2 shadow-lg"
          style={{
            background: styles.cardBg,
            borderColor: styles.border,
            borderRadius: '8px',
            boxShadow: isDarkMode 
              ? '0 4px 8px rgba(0, 0, 0, 0.8)' 
              : '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 
            className="text-lg font-semibold mb-4 flex items-center gap-2" 
            style={{ color: styles.accent }}
          >
            <span className="text-xl">📬</span>
            Get In Touch
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📞', label: 'Phone', value: '(470) 908-7215', color: '#ef4444' },
              { icon: '✉️', label: 'Email', value: 'rishith.chintala@gmail.com', href: 'mailto:rishith.chintala@gmail.com', color: '#3b82f6' },
              { icon: '📷', label: 'Instagram', value: '@the_meridian_collection', href: 'https://www.instagram.com/the_meridian_collection', color: '#eab308' },
              { icon: '💼', label: 'LinkedIn', value: 'Rishith Chintala', href: 'https://www.linkedin.com/in/rishith-chintala-012553232', color: '#22c55e' }
            ].map((contact, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 border-2 transition-all hover:scale-[1.02]"
                style={{
                  background: isDarkMode ? '#0a0a0a' : '#ffffff',
                  borderColor: contact.color,
                  borderRadius: '6px',
                  borderLeftWidth: '3px'
                }}
              >
                <div 
                  className="w-10 h-10 flex items-center justify-center border-2"
                  style={{
                    background: `${contact.color}20`,
                    borderColor: contact.color,
                    borderRadius: '6px'
                  }}
                >
                  <span className="text-base">{contact.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium mb-0.5" style={{ color: contact.color }}>
                    {contact.label}
                  </p>
                  {contact.href ? (
                    <a 
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs hover:underline block truncate"
                      style={{ color: styles.text }}
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-xs truncate" style={{ color: styles.text }}>
                      {contact.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="text-center p-4 border-t-2"
          style={{ 
            borderColor: styles.border,
            color: styles.textSecondary
          }}
        >
          <p className="text-xs mb-1">
            Thanks for visiting my Windows XP Portfolio! 🎉
          </p>
          <p className="text-xs">
            Created with passion for retro computing and modern portfolio presentation
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slidePattern {
          0% { transform: translateX(0); }
          100% { transform: translateX(20px); }
        }
      `}</style>
    </div>
  );
}
