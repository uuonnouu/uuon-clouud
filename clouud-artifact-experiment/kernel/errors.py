class KernelError(Exception):
    """Base exception for CLOUUD kernel failures."""


class UnsupportedAlgorithmError(KernelError):
    """Raised when an unknown compression algorithm is requested."""


class IntegrityError(KernelError):
    """Raised when artifact integrity verification fails."""
