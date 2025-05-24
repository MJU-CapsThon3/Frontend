export const baseContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // 노랑-주황 그라디언트 배경
  background: 'linear-gradient(to bottom, #ffdb4b, #ffa136)',
  textAlign: 'center',
  padding: '1.5rem 2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  opacity: 0.95,
};

export const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  marginBottom: '0.5rem',
  color: '#213547',
};

export const subtitleStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#666',
  marginBottom: '1.5rem',
};

export const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  // gap: '0.5rem',
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '6px',
  transition: 'border-color 0.3s ease',
};

export const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  backgroundColor: '#a1c5e6',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  animation: 'fadeInUp 0.7s ease-in-out',
};

export const dashStyle: React.CSSProperties = {
  fontSize: '1.2rem',
};

export const passwordWrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
};

export const eyeIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  color: '#bbb',
};

export const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
};

export const linkStyle: React.CSSProperties = {
  color: '#646cff',
  textDecoration: 'none',
  marginLeft: '0.25rem',
};

export const signupFooterStyle: React.CSSProperties = {
  marginTop: '1rem',
  color: '#666',
  fontSize: '0.875rem',
};

export const genderButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '6px',
  cursor: 'pointer',
  backgroundColor: '#fff',
  transition: 'background-color 0.3s ease, border-color 0.3s ease',
};

export const activeGenderButtonStyle: React.CSSProperties = {
  ...genderButtonStyle,
  borderColor: '#a1c5e6',
  backgroundColor: '#a1c5e6',
  color: '#fff',
};
