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
    public class MessageController : ApiController
    {
        private DoctorPatientEntities db = new DoctorPatientEntities();

        [HttpGet]
        public IHttpActionResult GetMessage(int Message_ID)
        {
            Message message = db.Messages.Find(Message_ID);
         
            if (message == null)
            {
                return NotFound();
            }

            return Ok(message);
        }
        [HttpGet]
        public IHttpActionResult GetMessages(string To_ID,string From_ID)
        {
            try
            {
                var messages = db.Messages.Where(m => m.To_ID == To_ID&&m.From_ID==From_ID).ToList();
                return Ok(messages);
            }
            catch (Exception)
            {

                throw;
            }
           
        }
        [HttpGet]
        public IHttpActionResult DeleteMessages(string To_ID, string From_ID)
        {
            try
            {
                var messages = db.Messages.Where(m => m.To_ID == To_ID).ToList();
                db.Messages.RemoveRange(messages);
                db.SaveChanges();
                return Ok(messages.Count());
            }
            catch (Exception)
            {

                throw;
            }

        }
        [HttpPost]
        public IHttpActionResult PostMessage(Message message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var m=db.Messages.Add(message);
            try
            {
                db.SaveChanges();

            }
            catch (Exception)
            {

                throw;
            }

            return Ok(m.Message_ID);
        }

        // DELETE: api/Message/5
        [ResponseType(typeof(Message))]
        public IHttpActionResult DeleteMessage(int id)
        {
            Message message = db.Messages.Find(id);
            if (message == null)
            {
                return NotFound();
            }

            db.Messages.Remove(message);
            db.SaveChanges();

            return Ok(message);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MessageExists(int id)
        {
            return db.Messages.Count(e => e.Message_ID == id) > 0;
        }
    }
}