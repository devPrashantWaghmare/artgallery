const ArtistRegister = ({
    handleSubmit,
    mobileNumber,
    setMobileNumber,
    email,
    setEmail,
    newUserName,
    setNewUserName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errorMessage,
  }) => {
    const artCategories = [
      'Painting',
      'Digital Art',
      'Sculpture',
      'Photography',
      'Mixed Media',
      'Other',
    ];
  
    const validateMobile = (mobile) => /^\d{10}$/.test(mobile);
    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validatePassword = (password) =>
      password.length >= 8 && /\d/.test(password) && /[A-Za-z]/.test(password);
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          onBlur={() => {
            if (!validateEmail(email)) alert('Invalid email format');
          }}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
          onBlur={() => {
            if (!validateMobile(mobileNumber)) alert('Invalid mobile number');
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          onBlur={() => {
            if (!validatePassword(password))
              alert('Password must be at least 8 characters long and contain letters and numbers');
          }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <textarea placeholder="Tell us about your art" required />
        <label>Select Art Categories:</label>
        <select required>
          {artCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Register as Artist</button>
      </form>
    );
  };
  
  export default ArtistRegister;
  