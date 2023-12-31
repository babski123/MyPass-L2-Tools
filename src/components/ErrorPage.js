import { useRouteError, Link } from "react-router-dom";
import { Box, Heading, Text } from '@chakra-ui/react'

export default function NotFound() {

  const error = useRouteError();
  console.error(error);

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
      >
        Oops!
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        {error.statusText || error.message}
      </Text>
      <Text color={'gray.500'} mb={6}>
        Sorry, an unexpected error has occurred.
      </Text>

      <Link className="hoverable-link" as="a"
        to="/"
        variant="solid">
        HOME
      </Link>
    </Box>
  )
}