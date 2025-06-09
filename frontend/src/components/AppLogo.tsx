
type Props = {
    size?: number;
}

export default function AppLogo({size}: Props) {
  return (
    <>
        <img src='/brand/logo-dark.svg' alt='logo' width={size || 100} />
    </>
  )
}