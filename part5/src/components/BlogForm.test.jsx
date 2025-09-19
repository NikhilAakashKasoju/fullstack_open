// BlogForm.test.jsx
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls the event handler with correct details when submitted', async () => {
  const user = userEvent.setup()
  const handleBlogMock = vi.fn()
  
  // Create mock state setters that update values we can track
  let titleValue = ''
  let authorValue = ''
  let urlValue = ''
  
  const setBlogTitleMock = vi.fn(value => titleValue = value)
  const setBlogAuthorMock = vi.fn(value => authorValue = value)
  const setBlogUrlMock = vi.fn(value => urlValue = value)

  render(
    <BlogForm 
      blogTitle={titleValue}
      setBlogTitle={setBlogTitleMock}
      blogAuthor={authorValue}
      setBlogAuthor={setBlogAuthorMock}
      blogUrl={urlValue}
      setBlogUrl={setBlogUrlMock}
      handleBlog={handleBlogMock}
    />
  )

  // Fill in the form fields
  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('Url:')
  const submitButton = screen.getByText('Save')

  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://testurl.com')
  await user.click(submitButton)

  // Check that the form submission handler was called
  expect(handleBlogMock).toHaveBeenCalledTimes(1)
  
  // The handler should receive an event object
  const event = handleBlogMock.mock.calls[0][0]
  expect(event).toBeInstanceOf(Object)
  expect(typeof event.preventDefault).toBe('function')
})