const Button = ({
  children,
  onClick,
  loading,
  disabled,
  variant = "primary",
}) => {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition";

  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${styles[variant]} disabled:bg-gray-400`}
    >
      {loading ? "Processing..." : children}
    </button>
  );
};

export default Button;