export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className={`text-[13px] font-semibold text-muted underline-offset-2 hover:underline ${className ?? ""}`}
      >
        Sign out
      </button>
    </form>
  );
}
