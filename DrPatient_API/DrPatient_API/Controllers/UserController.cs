using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using DrPatient_API.Models;

namespace DrPatient_API.Controllers
{
    public class UserController : ApiController
    {
        private DoctorPatientEntities db = new DoctorPatientEntities();

        // GET: api/User
        [HttpGet]
        public IHttpActionResult IsUser(string Phone)
        {
            var row = db.Users.Where(u=>u.Phone==Phone).FirstOrDefault();
            if (row != null)
            {
                return Ok(row);
            }
            return BadRequest();
        }
        public IHttpActionResult GetUsers(string Phone)
        {
            var friends=db.Friends.Where(f=>f.From_ID==Phone||f.To_ID==Phone);
            List<string> vs = new List<string>();
            foreach (var item in friends)
            {
                var row =(UserFriendView) db.Users.Where(u => u.Phone != Phone && (u.Phone == item.To_ID || u.Phone == item.From_ID)).FirstOrDefault();
                if (item.To_ID == Phone)
                {
                    row.IsBlock_ByMe = item.IsBlock_To;
                    vs.Add(item.From_ID);
                }
                else
                {
                    row.IsBlock_ByFriend = item.IsBlock_From;
                    vs.Add(item.To_ID);
                }
                row.Friend_Type = item.Friend_Type;
            }
            var ufv2 = new List<UserFriendView>();
            var ulist = db.Users.Where(u => u.Phone != Phone && !vs.Contains(u.Phone)&&u.Role!="Admin").ToList();
            foreach (var item in ulist)
            {
                var row = (UserFriendView)item;
                ufv2.Add(row);
            }
  
            return Ok(ufv2);
        }

        // GET: api/User/5
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(string id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/User/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUser(string id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.Phone)
            {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/User
        [ResponseType(typeof(User))]
        public IHttpActionResult PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Users.Add(user);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.Phone))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = user.Phone }, user);
        }

        // DELETE: api/User/5
        [ResponseType(typeof(User))]
        public IHttpActionResult DeleteUser(string id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            db.SaveChanges();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(string id)
        {
            return db.Users.Count(e => e.Phone == id) > 0;
        }
    }
}