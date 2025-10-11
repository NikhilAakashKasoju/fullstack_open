import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'component testing is done in react using',
    author: 'react'
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText(/Title:\s*component testing is done in react using/i)).toBeInTheDocument()
  expect(screen.getByText(/Author:\s*react/i)).toBeInTheDocument()
  // expect(screen.getByText('Title: component testing is done in react using')).toBeInTheDocument()
  // expect(screen.getByText('Author: react')).toBeInTheDocument()
})

test('blog URL and likes are shown when view button is clicked', async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testurl.com',
    likes: 42,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  // Mock functions for props
  const mockHandleLikes = vi.fn()
  const mockHandleDelete = vi.fn()

  render(
    <Blog
      blog={blog}
      handleLikes={mockHandleLikes}
      handleDelete={mockHandleDelete}
      user={{ username: 'testuser' }}
    />
  )

  // Initially, URL and likes should not be visible
  // We can check by looking for elements that are not visible
  const urlElement = screen.queryByText('https://testurl.com')
  const likesElement = screen.queryByText('42')

  // They might exist in DOM but be hidden, so we need to check visibility
  if (urlElement) {
    expect(urlElement).not.toBeVisible()
  }
  if (likesElement) {
    expect(likesElement).not.toBeVisible()
  }

  // Find and click the view button
  const viewButton = screen.getByText('View')
  await userEvent.click(viewButton)

  // After clicking, URL and likes should be visible
  // Use a more flexible approach to find the text
  expect(screen.getByText(/https:\/\/testurl\.com/)).toBeVisible()
  expect(screen.getByText(/42/)).toBeVisible()
  expect(screen.getByText(/Test User/)).toBeVisible()
})

test('like button event handler is called twice when clicked twice', async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testurl.com',
    likes: 42,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  // Create a mock function for handleLikes
  const mockHandleLikes = vi.fn()
  const mockHandleDelete = vi.fn()

  render(
    <Blog
      blog={blog}
      handleLikes={mockHandleLikes}
      handleDelete={mockHandleDelete}
      user={{ username: 'testuser' }}
    />
  )

  // First, click the view button to show the like button
  const viewButton = screen.getByRole('button', { name: 'View' })
  await userEvent.click(viewButton)

  // Find the like button
  const likeButton = screen.getByRole('button', { name: 'Like' })

  // Click the like button twice
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  // Verify that the mock function was called twice
  expect(mockHandleLikes).toHaveBeenCalledTimes(2)

  // Verify that it was called with the correct argument (the blog object)
  expect(mockHandleLikes).toHaveBeenCalledWith(blog)
  expect(mockHandleLikes).toHaveBeenNthCalledWith(1, blog)
  expect(mockHandleLikes).toHaveBeenNthCalledWith(2, blog)
})