import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Blog from '../Blog'; 
import Create from '../Create';
import blogService from '../../services/blogs.js';

describe('Blog component', () => {
  it('renders the title without clicking anything', () => {
    const blog = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 5,
      user: {
        name: 'Test User',
        _id: '123',
      },
    };

    const mockHandleLike = vi.fn();
    const mockHandleDelete = vi.fn();

    render(<Blog blog={blog} handleLike={mockHandleLike} handleDelete={mockHandleDelete} />);

    expect(screen.getByText(/Test Blog Title/i)).toBeInTheDocument();
  });

  it('renders the title, author, url, likes, and user when the "View" button is clicked', () => {
    const blog = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 5,
      user: {
        name: 'Test User',
        _id: '123',
      },
    };

    const mockHandleLike = vi.fn();
    const mockHandleDelete = vi.fn();

    render(<Blog blog={blog} handleLike={mockHandleLike} handleDelete={mockHandleDelete} />);

    expect(screen.getByText(/Test Blog Title/i)).toBeInTheDocument();

    expect(screen.queryByText(/Test Author/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/http:\/\/testurl.com/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Likes: 5/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Test User/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('View'));

    expect(screen.getByText(/Test Author/i)).toBeInTheDocument();
    expect(screen.getByText(/http:\/\/testurl.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Likes: 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });

  it('calls the handleLike function twice when the like button is clicked twice', () => {
    const blog = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 5,
      user: {
        name: 'Test User',
        _id: '123',
      },
    };

    const mockHandleLike = vi.fn();
    const mockHandleDelete = vi.fn();

    render(<Blog blog={blog} handleLike={mockHandleLike} handleDelete={mockHandleDelete} />);

    // Klikataan ensin "View"-nappia, jotta like-nappi tulee näkyviin
    fireEvent.click(screen.getByText('View'));

    // Etsitään like-nappi ja klikataan sitä kahdesti
    const likeButton = screen.getByText('Like');
    
    fireEvent.click(likeButton); // Klikkaa ensimmäisen kerran
    fireEvent.click(likeButton); // Klikkaa toisen kerran

    // Varmistetaan, että mock-tapahtumankäsittelijä funktiota on kutsuttu kaksi kertaa
    expect(mockHandleLike).toHaveBeenCalledTimes(2);
  });
});

describe('Create component', () => {
  it('calls onBlogAdded with the correct data when the form is submitted', async () => {

    const mockOnBlogAdded = vi.fn();

    vi.spyOn(blogService, 'create').mockResolvedValue({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testurl.com',
    });

    render(<Create onBlogAdded={mockOnBlogAdded} />);

    fireEvent.change(screen.getByPlaceholderText('Enter blog title'), { target: { value: 'Test Blog Title' } });
    fireEvent.change(screen.getByPlaceholderText('Enter blog author'), { target: { value: 'Test Author' } });
    fireEvent.change(screen.getByPlaceholderText('Enter blog URL'), { target: { value: 'http://testurl.com' } });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => expect(mockOnBlogAdded).toHaveBeenCalledTimes(1)); 
    expect(mockOnBlogAdded).toHaveBeenCalledWith({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testurl.com',
    });
  });
});