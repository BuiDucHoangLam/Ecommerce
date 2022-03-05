import React from 'react'

const CategoryForm = ({onSubmit,name,functionality,change}) => {
  return(
  <form onSubmit={onSubmit}>
    <label>Name</label>
    <input 
      name='name'
      type='text' 
      className='form-control' 
      value={name} 
      onChange={e=>change(e.target.value)}
      placeholder="Insert which category you want here!"
      autoFocus
      required
    />
    <br/>
    <button onClick ={onSubmit} type="submit" className="btn btn-raised">
      {functionality}
    </button>
  </form>
  )
}

export default CategoryForm
